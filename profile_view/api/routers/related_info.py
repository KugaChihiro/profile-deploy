import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from api.database import get_db
from api.schemas import RelatedInfoCreate, RelatedInfoUpdate, RelatedInfoOut
from api.crud.related_info import related_info_crud
from api.routers.storage import generate_read_sas_url

router = APIRouter(prefix="/related_info", tags=["related_info"])


# 全件取得（GET /related_info）
@router.get("/", response_model=list[RelatedInfoOut])
async def read_all_related_info(db: AsyncSession = Depends(get_db)):
    related_info_list = await related_info_crud.get_all(db)


    for item in related_info_list:
        # プロフィール動画サムネイル
        if item.profile_thumbnail_url:
            blob_name = os.path.basename(item.profile_thumbnail_url)
            item.profile_thumbnail_url = generate_read_sas_url(blob_name)
        # セミナー動画サムネイル
        if item.seminar_thumbnail_url:
            urls = item.seminar_thumbnail_url.split(',')
            sas_urls = []
            for url in urls:
                if url:
                    clean_url = url.split('?')[0]
                    blob_name = os.path.basename(clean_url)
                    sas_urls.append(generate_read_sas_url(blob_name))
                else:
                    sas_urls.append("")

            item.seminar_thumbnail_url = ",".join(sas_urls)

    return related_info_list


# 特定の関連情報を取得（GET /related_info/{id}）
@router.get("/{id}", response_model=RelatedInfoOut)
async def read_related_info(id: int, db: AsyncSession = Depends(get_db)):
    item = await related_info_crud.get(db, "id", id)
    if not item:
        raise HTTPException(status_code=404, detail="Related info not found")


    # プロフィール動画サムネイル
    if item.profile_thumbnail_url:
        blob_name = os.path.basename(item.profile_thumbnail_url)
        item.profile_thumbnail_url = generate_read_sas_url(blob_name)
    # セミナー動画サムネイル
    if item.seminar_thumbnail_url:
        urls = item.seminar_thumbnail_url.split(',')
        sas_urls = []
        for url in urls:
            if url:
                clean_url = url.split('?')[0]
                blob_name = os.path.basename(clean_url)
                sas_urls.append(generate_read_sas_url(blob_name))
            else:
                sas_urls.append("")

        item.seminar_thumbnail_url = ",".join(sas_urls)

    return item


# 新規作成（POST /related_info）
@router.post("/", response_model=RelatedInfoOut)
async def create_related_info(item: RelatedInfoCreate, db: AsyncSession = Depends(get_db)):
    return await related_info_crud.create(db, item.dict())


# 更新（PUT /related_info/{id}）
@router.put("/{id}", response_model=RelatedInfoOut)
async def update_related_info(id: int, update: RelatedInfoUpdate, db: AsyncSession = Depends(get_db)):
    updated = await related_info_crud.update(db, "id", id, update.dict(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Related info not found")
    return updated


# 削除（DELETE /related_info/{id}）
@router.delete("/{id}")
async def delete_related_info(id: int, db: AsyncSession = Depends(get_db)):
    success = await related_info_crud.delete(db, "id", id)
    if not success:
        raise HTTPException(status_code=404, detail="Related info not found")
    return {"detail": "Related info deleted"}