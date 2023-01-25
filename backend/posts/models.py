from django.db import models


class Post(models.Model):
    title = models.CharField(max_length=100, null=False)
    description = models.CharField(max_length=100, null=False)
    image = models.ImageField(null=True, blank=True, upload_to="images/")
    isFavourite = models.BooleanField(default=False)

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "%s" % self.title

    class Meta:
        ordering = ["-created_at"]


class Tags(models.Model):
    name = models.CharField(max_length=100, null=False, unique=True)


class PostTag(models.Model):
    post = models.ForeignKey(
        "Post",
        on_delete=models.CASCADE,
        related_name="tag_set",
        related_query_name="tag_set",
    )
    tag = models.ForeignKey(
        "Tags",
        on_delete=models.CASCADE,
        related_name="post_set",
        related_query_name="post_set",
    )
