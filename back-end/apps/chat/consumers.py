import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import ChatRoom, Message
from apps.accounts.models import UserProfile
from django.utils import timezone

# difesa per attacchi
from django.utils.html import escape

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
        username = text_data_json["username"]
        message_payload = text_data_json["message"]

        # toglie la formattazione html nei messaggi
        message_payload = escape(message_payload)

        # non fa inviare i messaggi vuoti
        if (message_payload == "" or message_payload.strip() == ""):
            return
    
        print("User: ", username, ", Message: ", message_payload)

        room_name = self.scope["url_route"]["kwargs"]["room_name"]
        user_sender = UserProfile.objects.get(username=username)
        current_time = timezone.now()

        message = Message.objects.create(
            room=ChatRoom.objects.get(name=room_name),
            user_sender=user_sender,
            message_payload=message_payload,
            time_stamp=current_time
        )

        # rispedisce in broadcast a tutti i client nella room il messaggio (in formato json)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                # nome della funzione che fa handling di questo evento
                "type":"chat_message",

                # param che verranno condensati un oggetto "event" che verrà passato come param di chat_message()
                "username":username,
                "message":message_payload,
                "time_stamp":str(current_time)
            })
        
    def chat_message(self, event):
        message = event["message"]
        username = event["username"]
        time_stamp = event["time_stamp"]

        self.send(text_data=json.dumps({
            "type":"chat",
            "username":username,
            "message":message,
            "time_stamp":time_stamp
        }))