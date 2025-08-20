from django.shortcuts import render
from .serializers import*
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)