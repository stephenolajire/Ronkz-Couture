from django.shortcuts import render
from .serializers import*
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from rest_framework import status

# Create your views here.
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response(serializer.data)
    
class ProductListView(APIView):
    def get(self, request):
        try:
            # Get category from query parameters
            category_slug = request.query_params.get('category', None)
            
            if category_slug:
                # Filter by category slug
                category = get_object_or_404(Category, slug=category_slug)
                products = Product.objects.filter(category=category)
            else:
                # Return all products
                products = Product.objects.all()
            
            # Additional filtering options
            search = request.query_params.get('search', None)
            if search:
                products = products.filter(name__icontains=search)
            
            # Price filtering
            min_price = request.query_params.get('min_price', None)
            max_price = request.query_params.get('max_price', None)
            
            if min_price:
                try:
                    min_price = float(min_price)
                    products = products.filter(price__gte=min_price)
                except (ValueError, TypeError):
                    return Response(
                        {'error': 'Invalid min_price value. Must be a number.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if max_price:
                try:
                    max_price = float(max_price)
                    products = products.filter(price__lte=max_price)
                except (ValueError, TypeError):
                    return Response(
                        {'error': 'Invalid max_price value. Must be a number.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Ordering
            ordering = request.query_params.get('ordering', 'name')
            if ordering:
                # Validate ordering field to prevent errors
                valid_ordering_fields = ['name', '-name', 'price', '-price', 'created_at', '-created_at']
                if ordering in valid_ordering_fields:
                    products = products.order_by(ordering)
                else:
                    # Default to name if invalid ordering is provided
                    products = products.order_by('name')
            
            serializer = ProductSerializer(products, many=True, context={'request': request})
            return Response({
                'count': products.count(),
                'results': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Category.DoesNotExist:
            return Response(
                {'error': 'Category not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': 'Something went wrong fetching products'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer