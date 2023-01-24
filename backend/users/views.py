from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import UserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refresh = RefreshToken.for_user(User.objects.get(pk=serializer.data["id"]))
        user = serializer.data
        user["refresh"] = str(refresh)
        user["access"] = str(refresh.access_token)
        return Response(user, status=status.HTTP_201_CREATED)


class UserDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        data = request.data
        user = User.objects.get(pk=request.user.pk)
        try:
            user.name = data["name"]
            user.email = data["email"]
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except Exception as e:
            raise APIException(
                detail="Invalid fields", code=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        data = request.data
        user = User.objects.get(pk=request.user.pk)
        try:
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            raise APIException(detail=str(e))
