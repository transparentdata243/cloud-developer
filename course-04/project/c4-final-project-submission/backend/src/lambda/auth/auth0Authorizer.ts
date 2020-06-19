import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = '...'
const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJCj6hSqo2D2toMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi0za2J5OXkzaS5hdXRoMC5jb20wHhcNMjAwNTI0MTgzNDM1WhcNMzQw
MTMxMTgzNDM1WjAhMR8wHQYDVQQDExZkZXYtM2tieTl5M2kuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlOJXl9/pbkRYWP5BiunkEk1C
3FJmIyD6JBlCTrlQvoeY2m91szUPv01TudhaTQRS4tiWalxLnu39BgjgfOCmNxHA
DDJj5jz011S9EURSPv+WVhAfNGXvw6fj89TQZQGVYnMAR+xhhpTXkYxpQBYbk9dH
zhCIEne9qf3NJhE4nERsPtnEKbS8oTqo+A60byaFFpBgRBkS3/zHQek4wDeCO2rK
bD6vLlarJ31TidaDpTo9zIJlYT+QEYW8L4eNW5cgrV5N1ifnI+gbzdYbTUowpugS
ST437CyZfFT7qRIfHNdAsVRKJA/vDyZAEDP2GS/jnAjhAKamTiK2imZq34u+2wID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBR+cNffRhYdsWHN+dAL
FcMWW47EnjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAB9+isgw
NBY7DCEtaLaAuZESpnY1qeMUIbrKVMccFveAyT8ooJM5M26jF16AsDT0yMny1qsI
00oQD7rvCPJ+EHJGXq/I7f/1Bb1dN3nnUk99mWStKtF6tYv/YLMyk5JHFToltdGP
475ij6irN1yEFbmH3IPemoBoRLEyHXLxjThdm8b2lfXmCIs2CBiCiZk/xCkWPraG
QOpoOmaCp0U2cn/ZeQwypNB/LCUXTnPIGgWH83eK8VKL7TrDUEilxUI3DMcCWQgA
FAHycRLQl5xGGrUmwtgmhhi/OWPwTi6tddgWaD8PROpNqYVa1mFe0vFqz5ws5z78
zyyTb2/sBcc4dGg=
-----END CERTIFICATE-----`


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  console.log(token)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}