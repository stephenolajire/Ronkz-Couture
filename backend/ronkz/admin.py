from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(CustomOrder)
admin.site.register(CustomOrderNote)
admin.site.register(CustomerMeasurement)
class CustomOrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'occasion', 'budget', 'status', 'created_at']
    list_filter = ['occasion', 'budget', 'status', 'created_at']
    search_fields = ['first_name', 'last_name', 'occasion', 'budget']
    readonly_fields = ['id', 'created_at']

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

class CustomOrderNoteAdmin(admin.ModelAdmin):
    list_display = ['custom_order', 'note_preview', 'created_by', 'created_at']
    list_filter = ['created_by', 'created_at']
    search_fields = [
        'custom_order__first_name', 'custom_order__last_name',
        'note', 'created_by__username'
    ]
    readonly_fields = ['created_by', 'created_at']
    
    def note_preview(self, obj):
        return obj.note[:50] + '...' if len(obj.note) > 50 else obj.note
    note_preview.short_description = 'Note Preview'
    
    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)