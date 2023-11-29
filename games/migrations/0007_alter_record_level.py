# Generated by Django 4.2.4 on 2023-11-26 17:21

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("games", "0006_record_game_time"),
    ]

    operations = [
        migrations.AlterField(
            model_name="record",
            name="level",
            field=models.PositiveSmallIntegerField(
                choices=[(1, "1"), (2, "2"), (3, "3")], default=1
            ),
        ),
    ]
