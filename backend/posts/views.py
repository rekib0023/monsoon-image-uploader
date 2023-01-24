from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Post
from .serializers import PostSerializer


class PostsView(ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = Post.objects.all()
        show_fav = self.request.query_params.get("showFav")
        if show_fav is not None:
            queryset = queryset.filter(isFavourite=True)
        return queryset
