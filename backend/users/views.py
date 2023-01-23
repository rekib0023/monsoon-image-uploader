
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refresh = RefreshToken.for_user(User.objects.get(pk=serializer.data['id']))
        user = serializer.data
        user["refresh"] = str(refresh)
        user["access"] = str(refresh.access_token)
        return Response(user, status=status.HTTP_201_CREATED)
