import geradorcpf

users = [
	{
     "name": "new valid user",
     "email": "validuser@yahoo.com",
     "password": "Conectcar16",
     "cpf": geradorcpf.cpf(),
     "birthdate": "10/10/2013",
     "phone": "11 977654435",
     "address": "avenida Sao Gualter, 187, ap 84, Sao Paulo, Sp, 05455001",
	 "test_case": "new_unregistered_user"
    },

	{
	 "name": "registered valid user",
	 "email": "validuser@yahoo.com",
	 "password": "Conectcar16",
	 "cpf": "40682573108",
	 "birthdate": "10/10/2013",
	 "phone": "11 977654435",
	 "address": "avenida Sao Gualter, 187, ap 84, Sao Paulo, Sp, 05455001",
	 "facebook": {"email": "wfonphjsfg_1503672042@tfbnw.net", "password": "Conectcar16"},
	 "test_case": "registered_user"
	},

	{
	 "name": "registered uncompleted user",
	 "email": "validuser@yahoo.com",
	 "password": "Conectcar16",
	 "cpf": "99981637068",
	 "birthdate": "21/10/1977",
	 "phone": "11 977654435",
	 "address": "avenida Sao Gualter, 187, ap 84, Sao Paulo, Sp, 05455001",
	 "test_case": "client_with_no_user"
	}
]

vehicles = [
	{
	 "plaque": "BLS-5096",
	 "tag": "1127734",
	 "sticker": "000000000000002",
	 "test_case": "vehicle_legado"
	},
	{
	 "plaque": "iue-3047",
	 "tag": "230635",
	 "sticker": "202114",
	 "test_case": "unregistered_vehicle_1"
	},
    {
	 "plaque": "nme-3837",
	 "tag": "230635",
	 "sticker": "202114",
	 "test_case": "unregistered_vehicle_2"
	},
    {
	 "plaque": "lks-3037",
	 "tag": "230635",
	 "sticker": "202114",
	 "test_case": "unregistered_vehicle_3"
	},
    {
	 "plaque": "owq-3037",
	 "tag": "230635",
	 "sticker": "202114",
	 "test_case": "unregistered_vehicle_4"
	},
    {
	 "plaque": 'oiw-8734',
	 "tag": "230635",
	 "sticker": "202114",
	 "test_case": "unregistered_vehicle_5"
	},
]

cards = [
    {
     "card_number": "5317676441607227",
     "card_owner": "JOSE MOLLIGAN",
     "card_expire_date": "10/19",
     "card_cvv": "397",
	 "test_case": "valid_card"
    },
    {
     "card_number": "4929167569563825",
     "card_owner": "INVALID CARD",
     "card_expire_date": "10/19",
     "card_cvv": "397",
	 "test_case": "invalid_card"
    }
]

def get_user(test_case):
	return (user for user in users if user["test_case"] == test_case).next()

def get_vehicle(test_case):
    return (vehicle for vehicle in vehicles if vehicle["test_case"] == test_case).next()

def get_card(test_case):
    return (card for card in cards if card["test_case"] == test_case).next()
