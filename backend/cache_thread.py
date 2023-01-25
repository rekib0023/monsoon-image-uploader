import threading

from django.core.cache import cache


def publish_redis_cache(name, data):
    def thread_function(key, value):
        if cache.get(key) is not None:
            cache.delete(key)
        cache.set(key, value)

    x = threading.Thread(target=thread_function, args=(name, data))
    x.start()
