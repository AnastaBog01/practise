from django.db import models

class Animal(models.Model):
    class Gender(models.IntegerChoices):
        MALE = 1, 'Самец'
        FEMALE = 2, 'Самка'

    class Breed(models.IntegerChoices):
        DOG = 1, 'Собака, беспородная'
        CAT = 2, 'Кошка, беспородная'

    class Municipality(models.IntegerChoices):
        MURMANSK = 1, 'г. Мурманск'
        APATITY = 2, 'г. Апатиты'
        MONCHEGORSK = 3, 'г. Мончегорск'

    id = models.IntegerField(primary_key=True)
    reg_number = models.IntegerField()
    gender = models.IntegerField(choices=Gender.choices)
    breed = models.IntegerField(choices=Breed.choices)
    municipality = models.IntegerField(choices=Municipality.choices)

    def __str__(self):
        return f"Animal {self.reg_number}"

class Event(models.Model):
    class EventKind(models.IntegerChoices):
        CAPTURE = 1, 'Отлов'
        PRIMARY_INSPECTION = 2, 'Первичный осмотр'
        CLINICAL_INSPECTION = 4, 'Клинический осмотр'
        CONTAINMENT = 12, 'Содержание'
        RETURN_TO_ENVIRONMENT = 9, 'Возврат в прежнюю среду'

    animal = models.ForeignKey(Animal, related_name='events', on_delete=models.CASCADE)
    kind = models.IntegerField(choices=EventKind.choices)
    execution_date = models.DateTimeField()

    def __str__(self):
        return f"Event {self.get_kind_display()} on {self.execution_date}"