import mysql.connector
import os
from dotenv import load_dotenv # type: ignore
import re

load_dotenv()

def slugify(value):
  value = re.sub(r'\s+', '-', value)  
  value = re.sub(r'[^\w\-]+', '', value)  
  value = re.sub(r'\-\-+', '-', value)  
  return value.lower()

try:
  conexao = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
  )
    
  cursor = conexao.cursor(dictionary=True)
  cursor.execute('SELECT id, produto, imagem FROM produtos')
  produtos = cursor.fetchall()
    
  for produto in produtos:
    slug = slugify(produto['produto'])
    cursor.execute('UPDATE produtos SET slug = %s WHERE id = %s', (slug, produto['id']))
    imagem = produto['imagem']
    imagem2 = imagem.replace('thumbs/45', 'thumbs/12')
    cursor.execute('UPDATE produtos SET imagem2 = %s WHERE id = %s', (imagem2, produto['id']))
    
  conexao.commit()
  cursor.close()
  conexao.close()
  
except mysql.connector.Error as err:
    print(f"Erro: {err}")
except Exception as e:
    print(f"Erro: {e}")