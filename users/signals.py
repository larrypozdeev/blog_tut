from django.db.models.signals import post_save, post_init, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_init, sender=Profile)
def save_old_image(sender, instance, **kwargs):
    if instance.image:
        instance._old_image = instance.image
        print(instance._old_image)

@receiver(post_save, sender=Profile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    new_image = instance.image
    if instance._old_image != "default.png" and instance._old_image != new_image:
        if instance._old_image:
            instance._old_image.delete(save=False)
            instance.image = new_image
