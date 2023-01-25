from django.core.cache import cache
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cache_thread import publish_redis_cache

from .models import Post, PostTag, Tags
from .serializers import PostSerializer, TagSerializer


class PostsView(ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = Post.objects.all()
        show_fav = self.request.query_params.get("showFav")
        if show_fav is not None:
            queryset = queryset.filter(isFavourite=True)
        tag = self.request.query_params.get("tag")
        if tag is not None:
            queryset = queryset.filter(tag_set__tag__name=tag)
        return queryset

    def create(self, request, *args, **kwargs):
        tags_data = request.data.pop("tags")[0].split(",")
        tags = dict(Tags.objects.all().values_list("name", "id"))
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()

        for tag in tags_data:
            if tag not in tags.keys():
                tag_obj = Tags.objects.create(name=tag)
                publish_redis_cache(name="tags", data=list(Tags.objects.all()))
                PostTag.objects.create(tag=tag_obj, post=post)
            else:
                PostTag.objects.create(tag_id=tags[tag], post=post)

        serializer = self.get_serializer(post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if request.query_params.get("showFav") is not None:
            if (fav_data := cache.get(f"{request.user.name}_fav_posts")) is not None:
                queryset = fav_data
            else:
                publish_redis_cache(f"{request.user.name}_fav_posts", queryset)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)


class PostDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = Post.objects.all()
    lookup_field = "id"
    serializer_class = PostSerializer
    http_method_names = ["get", "post", "patch", "delete"]

    def update(self, request, *args, **kwargs):
        post = get_object_or_404(Post, pk=kwargs["id"])
        serializer = self.get_serializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        post = serializer.save()
        publish_redis_cache(
            f"{request.user.name}_fav_posts",
            Post.objects.filter(isFavourite=True).all(),
        )
        serializer = self.get_serializer(post)
        return Response(serializer.data)


class TagsView(ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = (IsAuthenticated,)

    http_method_names = ["get"]

    def list(self, request, *args, **kwargs):
        if (data := cache.get("tags")) is not None:
            pass
        else:
            data = Tags.objects.all()
            publish_redis_cache(name="tags", data=list(data))
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)
