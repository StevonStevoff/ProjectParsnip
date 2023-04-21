from io import BytesIO
from os import path

from fastapi import HTTPException, UploadFile, status
from PIL import Image

from app.models import User

USER_PROFILE_IMG_STORE = "userdata/profileimages/"
USER_DEFAULT_PROFILE_IMG = USER_PROFILE_IMG_STORE + "default.png"
USER_PROFILE_IMG_FILE_FORMAT = ".png"


async def try_get_image(image: UploadFile) -> Image.Image:
    try:
        img = Image.open(BytesIO(image.file.read()))
    except Exception:
        detail = "Invalid Image"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

    return img


async def save_as_user_pfp(img: Image.Image, user: User):
    filepath = USER_PROFILE_IMG_STORE + str(user.id) + USER_PROFILE_IMG_FILE_FORMAT
    img.save(filepath, "PNG")


async def resize_image_for_profile(img: Image.Image) -> Image.Image:
    newImg = img.resize((128, 128))
    return newImg


async def get_user_pfp_path(user: User) -> str:
    user_image_file_name = str(user.id) + USER_PROFILE_IMG_FILE_FORMAT
    user_image_path = USER_PROFILE_IMG_STORE + user_image_file_name

    if not path.exists(user_image_path):
        user_image_path = USER_DEFAULT_PROFILE_IMG

    return user_image_path
