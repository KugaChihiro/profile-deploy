import os
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from azure.storage.blob import generate_blob_sas, BlobSasPermissions

from api.schemas import SasTokenRequest, SasTokenResponse
from api.config import settings

# プレフィックスとタグはご提示のコードに合わせます
router = APIRouter(prefix="", tags=["storage"])

# 接続文字列からアカウント名とキーを解析（一度だけ実行）
try:
    account_name = settings.AZURE_STORAGE_CONNECTION_STRING.split('AccountName=')[1].split(';')[0]
    account_key = settings.AZURE_STORAGE_CONNECTION_STRING.split('AccountKey=')[1].split(';')[0]
except (IndexError, AttributeError):
    raise RuntimeError("Azureの接続文字列(AZURE_STORAGE_CONNECTION_STRING)が無効です。")


def generate_read_sas_url(blob_name: str) -> str:
    """
    指定されたBlob名に対して、読み取り専用のSASトークン付きURLを生成する。
    この関数は他のルーターから呼び出して使用します。
    """
    if not blob_name:
        return ""

    # 読み取り用SASトークンの有効期限（例：1時間）
    sas_expires_on = datetime.now(timezone.utc) + timedelta(hours=1)

    # 読み取り(Read)権限のみを持つSASトークンを生成
    token = generate_blob_sas(
        account_name=account_name,
        container_name=settings.AZURE_STORAGE_CONTAINER_NAME,
        blob_name=blob_name,
        account_key=account_key,
        permission=BlobSasPermissions(read=True), # 権限を 'read' に設定
        expiry=sas_expires_on,
    )

    # 完全な読み取り用URLを返す
    return f"https://{account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER_NAME}/{blob_name}?{token}"
# ★★★★★ ここまで追加 ★★★★★


@router.post("/generate-sas-token", response_model=SasTokenResponse)
async def create_sas_token_for_upload(request: SasTokenRequest):
    """
    ファイルアップロード用のSASトークンを発行するエンドポイント
    """
    if not request.file_name:
        raise HTTPException(status_code=400, detail="fileNameは必須です。")

    try:
        sas_expires_on = datetime.now(timezone.utc) + timedelta(minutes=15)

        token = generate_blob_sas(
            account_name=account_name,
            container_name=settings.AZURE_STORAGE_CONTAINER_NAME,
            blob_name=request.file_name,
            account_key=account_key,
            permission=BlobSasPermissions(create=True, write=True),
            expiry=sas_expires_on,
        )

        sas_url = f"https://{account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER_NAME}/{request.file_name}?{token}"
        storage_url = f"https://{account_name}.blob.core.windows.net/{settings.AZURE_STORAGE_CONTAINER_NAME}/{request.file_name}"

        return SasTokenResponse(sasUrl=sas_url, storageUrl=storage_url)

    except Exception as e:
        print(f"SAS Token generation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="SASトークンの生成に失敗しました。"
        )