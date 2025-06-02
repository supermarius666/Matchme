from django import forms

class ContactForm(forms.Form):
    nome = forms.CharField(label='Name', max_length=25)
    email = forms.EmailField(label='Email')
    msg = forms.CharField(label='Messagge', widget=forms.Textarea)