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

cursor = conexao.cursor()

urls = [
  'https://www.zoom.com.br/landing-page/cashback-zoom-kabum'
]

header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

for url in urls:
  req = Request(url, headers=header)
  
  try:
    response = urlopen(req)
    page = response.read()
    soup = BeautifulSoup(page, 'html.parser')

    produtos = soup.find_all('div', class_='Paper_Paper__4XALQ Paper_Paper__bordered__cl5Rh Card_Card__Zd8Ef Card_Card__clicable__ewI68 ProductCard_ProductCard__WWKKW ProductCard_ProductCard__vertical__l4lvu')
    
    for produto in produtos:
      imagem_element = produto.find('img')
      produto_element = produto.find('h2', class_='Text_Text__ARJdp Text_MobileLabelXs__dHwGG Text_DesktopLabelSAtLarge__wWsED ProductCard_ProductCard_Name__U_mUQ')
      valor_element = produto.find('p', class_='Text_Text__ARJdp Text_MobileHeadingS__HEz7L')
      link_produto_element = produto.find('a', class_='ProductCard_ProductCard_Inner__gapsh')

      produto = produto_element.text.strip()
      valor = valor_element.text.strip()
      valor = valor.replace('R$', '').replace('.', '').replace(',', '.').strip()
      imagem = imagem_element['src'] 
      link = 'https://www.zoom.com.br' + link_produto_element['href'] 

      cursor.execute('SELECT produto FROM produtos WHERE produto=%s', (produto,))
      if cursor.fetchone() is None:
        cursor.execute('INSERT INTO produtos (produto, valor, imagem, link) VALUES (%s, %s, %s, %s)', (produto, valor, imagem, link))
        conexao.commit()
        
  except HTTPError as e:
    print(f'HTTP Error: {e.reason}')
  except URLError as e:
    print(f'URL Error: {e.reason}')
      
cursor.close()
conexao.close()