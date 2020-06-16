#!/usr/bin/python
import requests
import pprint

#fqdn="https://localhost:3443"

apiid = "9c6tfsf40i"
fqdn="https://" + apiid + ".execute-api.us-west-2.amazonaws.com/dev/groups"

pp = pprint.PrettyPrinter(indent=2)


def test():
  url = fqdn 
  
  res = requests.post(
    url = url
  )
 
  print(res.content)


#curl -k -i https://localhost:3443/users/login --request POST -H "Content-Type: application/json" --data-binary '{"username": "admin1", "password":"password"}'
def login():
  url = fqdn + "/users/login"
  #headers = {"Content-Type": "application/json"}
  # with same origin policy
  headers = {"Content-Type": "application/json", "Origin": "http://localhost:4200"}
  data = '{"username": "admin1", "password":"password"}'
  
  res = requests.post(
    url = url,
    headers = headers,
    data = data,
    verify = False  # self-signed cert verification has errors
  )
  
  json_res = res.json()
  #print(json_res)
  #print(json_res['token'])
  return json_res['token']


def login_url():
  url = fqdn + "/users/login"
  headers = {"Content-Type": "application/json"}
  params = {"username": "admin1", "password":"password"}
  
  res = requests.post(
    url = url,
    params = params,
    headers = headers,
    verify = False  # self-signed cert verification has errors
  )
  
  json_res = res.json()
  #print(json_res)
  print(json_res['token'])
  return json_res['token']

def signup():
  url = fqdn + "/users/signup"
  headers = {"Content-Type": "application/json"}
  data = '{"username": "admin1", "password":"password"}'
  
  res = requests.post(
    url = url,
    headers = headers,
    data = data,
    verify = False  # self-signed cert verification has errors
  )
  
  print(res.content)


def get_dishes(token):
  url = fqdn + "/dishes"
  
  res = requests.get(
    url = url,
    verify = False  # self-signed cert verification has errors
  )
 
  pp.pprint(res.headers)
  print(res.content)
  json_res = res.json()
  pp.pprint(json_res)


def post_dish(token):
  dish = '{"name": "kunpao chiken", \
			"image": "images/uthappizza.png", \
			"category": "mains", \
			"label": "Hot", \
			"price": "1.1111", \
			"featured": "true", \
			"description": "A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.", \
			"comments": [] \
		}'

  url = fqdn + "/dishes/"
  headers = {
      "Origin": "https://localhost:3443",
      "Content-Type": "application/json",
      "Authorization": "bearer " + token
      }
  res = requests.post(
    url = url,
    headers = headers,
    data = dish,
    verify = False  # self-signed cert verification has errors
  )
  print(res.headers)
  print(res.content)
  #json_res = res.json()
  #pp.pprint(json_res)


def delete_dishes(token):
  url = fqdn + "/dishes"

  headers = {
    "Origin": "http://localhost:4200",
    "Content-Type": "application/json",
    "Authorization": "bearer " + token
  }

  res = requests.delete(
    url = url,
    headers = headers,
    verify = False  # self-signed cert verification has errors
  )
  print(res.headers)
  print(res.content)


def get_favorites(token):
  url = fqdn + "/favorites/"

  res = requests.get(
    url = url,
    verify = False  # self-signed cert verification has errors
  )
  json_res = res.json()
  pp.pprint(json_res)
  return json_res

def delete_favorites(token):
  url = fqdn + "/favorites"

  headers = {
    "Content-Type": "application/json",
    "Authorization": "bearer " + token
  }

  res = requests.delete(
    url = url,
    headers = headers,
    verify = False  # self-signed cert verification has errors
  )
  print(res.content)


def post_favorite(token, dish_id):
  url = fqdn + "/favorites/" + dish_id
  headers = {
      "Content-Type": "application/json",
      "Authorization": "bearer " + token
      }
  res = requests.post(
    url = url,
    headers = headers,
    verify = False  # self-signed cert verification has errors
  )
  print(res.content)
  json_res = res.json()
  pp.pprint(json_res)


# -H "Content-Type:application/json" \
#	-H "Authorization:bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWEwNjJiM2U5ZDllNzgwMTZhYWRhMmUiLCJpYXQiOjE1ODc3ODg0MjcsImV4cCI6MTU4Nzc5MjAyN30.C33krjGAZG8nk2uf-Ef9q5ZtAyqLZs0FT29WpAco76A" \
def delete_favorite(token, dish_id):
  url = fqdn + "/favorites/" + dish_id
  headers = {"Authorization": "bearer " + token}
  res = requests.delete(
    url = url,
    headers = headers,
    verify = False  # self-signed cert verification has errors
  )
  print(res)
  json_res = res.json()
  pp.pprint(json_res)


def main():
  test()
  #signup()
  #token = login()
  #get_dishes(token)
  #post_dish(token)
  #delete_dishes(token)
  
  #json_res = get_favorites(token)
  #dish_id = json_res[0]['dishes'][0]['_id']
  #print(dish_id)
  #dish_id = '5ea46488ab642f205f0db42b'
  #post_favorite(token, dish_id)
  #delete_favorite(token, dish_id)
  #delete_favorites(token)


if __name__=="__main__":
  main()
