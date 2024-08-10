from bs4 import BeautifulSoup  # type: ignore
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
import mysql.connector # type: ignore
from dotenv import load_dotenv # type: ignore
import os
import json

load_dotenv()

conexao = mysql.connector.connect(
  host=os.getenv('DB_HOST'),
  user=os.getenv('DB_USER'),
  password=os.getenv('DB_PASSWORD'),
  database=os.getenv('DB_NAME')
)

cursor = conexao.cursor(dictionary=True)
cursor.execute('''
  SELECT produtos.id, produtos.link 
  FROM produtos  
  LEFT JOIN fichas ON produtos.id = fichas.produto_id 
  WHERE fichas.produto_id IS NULL
''')
produtos = cursor.fetchall()

header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

for produto in produtos:
  produto_id = produto['id']
  produto_link = produto['link']
  req = Request(produto_link, headers=header)

  try: 
    response = urlopen(req)
    page = response.read().decode('utf-8')
    soup = BeautifulSoup(page, 'html.parser')
    tabela = soup.find('table', class_='AttributeBlock_DetailsTable__w7YMx')
    tr_element = tabela.find_all('tr', class_='Row_Row__kKYw6')

    data = {}

    for row in tr_element:
      key = row.find('th', class_='AttributeName_Key__JJU2r').get_text(strip=True)
      value = row.find('td', class_='AttributeValues_Value__iqjHN').get_text(strip=True)
      data[key] = value
      data_json = json.dumps(data, ensure_ascii=False)
      try:    
        cursor.execute('INSERT INTO fichas (produto_id, dados) VALUES (%s, %s)', (produto_id, data_json))
        conexao.commit()
        print(f'Dados inseridos {produto_id}')
      except mysql.connector.Error as err:
        print(f'Erro: {err}')

  except HTTPError as e:
    print(f'HTTP Error: {e.reason}')
  except URLError as e:
    print(f'URL Error: {e.reason}')