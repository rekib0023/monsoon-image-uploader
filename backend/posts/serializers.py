from rest_framework import serializers

from .models import Post, Tags


class PostSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj):
        return obj.tag_set.all().values_list("tag__name", flat=True)

    def save(self, **kwargs):
        if self.instance is None:
            kwargs["created_by"] = self.fields["created_by"].get_default()
        return super().save(**kwargs)

    class Meta:
        model = Post
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = "__all__"
