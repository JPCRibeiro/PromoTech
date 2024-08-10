from bs4 import BeautifulSoup  # type: ignore
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import mysql.connector # type: ignore
from dotenv import load_dotenv # type: ignore
import os

load_dotenv()

conexao = mysql.connector.connect(
  host=os.getenv('DB_HOST'),
  user=os.getenv('DB_USER'),
  password=os.getenv('DB_PASSWORD'),
  database=os.getenv('DB_NAME')
)

cursor = conexao.cursor(dictionary=True)

cursor.execute('SELECT id, link FROM produtos WHERE descricao IS NULL')
produtos = cursor.fetchall()
    
header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}
    
for produto in produtos:
  link_produto = produto['link']
  req = Request(link_produto, headers=header)

  try:
    response = urlopen(req)
    page = response.read()
    soup = BeautifulSoup(page, 'html.parser')

    descricao_element = soup.find('div', class_='Text MobileLabelS')
    if descricao_element:
      descricao = descricao_element.text.strip()
    else:
      descricao = None
            
    cursor.execute('UPDATE produtos SET descricao = %s WHERE id = %s', (descricao, produto['id']))
    conexao.commit()
            
  except HTTPError as e:
    print(f'HTTP Error: {e.reason}')
  except URLError as e:
    print(f'URL Error: {e.reason}')
        
cursor.close()
conexao.close()