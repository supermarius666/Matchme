# Generated by Django 5.1.7 on 2025-05-16 17:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('chat', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('post_pic', models.ImageField(upload_to='post_pics')),
                ('text', models.CharField(max_length=1000)),
                ('time_stamp', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('MATCHED', 'Matched'), ('NOT_MATCHED', 'Not_Matched')], default='NOT_MATCHED', max_length=12)),
                ('room', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chat.chatroom')),
                ('user_receiving', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_receiving', to=settings.AUTH_USER_MODEL)),
                ('user_sending', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_sending', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('user_sending', 'user_receiving', 'room'), name='unique_constraint')],
            },
        ),
    ]
