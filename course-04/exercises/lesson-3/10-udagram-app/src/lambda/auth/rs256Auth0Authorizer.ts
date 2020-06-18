import 'source-map-support/register'
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    return null
}