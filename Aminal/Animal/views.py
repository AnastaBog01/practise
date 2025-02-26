from django.shortcuts import render
from django.http import JsonResponse
from .models import Animal, Event


def get_data(request):
    animals = Animal.objects.all()
    data = []
    for animal in animals:
        events = animal.events.all()
        animal_data = {
            'id': animal.id,
            'reg_number': animal.reg_number,
            'gender': animal.gender,
            'breed': animal.breed,
            'municipality': animal.municipality,
            'ordered_event_objects': [
                {
                    'id': event.id,
                    'kind': event.kind,
                    'execution_date': event.execution_date.strftime('%d.%m.%Y %H:%M:%S')
                } for event in events
            ]
        }
        data.append(animal_data)
    return JsonResponse(data, safe=False)



# def index(request):
#     return render(request, 'Animal/index.html')