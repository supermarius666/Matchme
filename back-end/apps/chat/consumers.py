import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

# fa handling dei dati in arrivo all'URL ws://localhost:8000/ws/<room_name> e spedisce anche dati ai client
class ChatConsumer(WebsocketConsumer):

    # si connette a client accettando la sua richiesta
    def connect(self):
        # prende <room_name> dall'URL
        url_path = self.scope["url_route"]["kwargs"]["room_name"] # self.scope["url_route"] = {'args': (), 'kwargs': {'room_name': 'room1'}}

        # crea gruppo (chatroom) [group -> room | channel -> user]
        self.room_group_name = url_path

        # aggiunge user (che corrisponde a "self.channel_name") alla room ("self.room_group_name")
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)

        # accetta richiesta di connessione proposta da client e crea connessione
        self.accept()

    # ascolta messaggio "text_data" in arrivo da un Client nella room
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        username = text_data_json["username"]

        print("User: ", username, ", Message: ", message)

        # rispedisce in broadcast a tutti i client nella room il messaggio (in formato json)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                # nome della funzione che fa handling di questo evento
                "type":"chat_message",

                # param che verranno condensati un oggetto "event" che verrà passato come param di chat_message()
                "message":message,
                "username":username
            })
        
    def chat_message(self, event):
        message = event["message"]
        username = event["username"]

        self.send(text_data=json.dumps({
            "type":"chat",
            "message":message,
            "username":username
        }))