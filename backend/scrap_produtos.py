from bs4 import BeautifulSoup  # type: ignore
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from dotenv import load_dotenv # type: ignore
import os
import psycopg2
import psycopg2.extras

load_dotenv()

conexao = psycopg2.connect(os.getenv("DB_URL"))
cursor = conexao.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

cursor = conexao.cursor()

urls = [
  'https://www.zoom.com.br/landing-page/cashback-zoom-kabum'
]

header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'}

for url in urls:
  print(f"🔗 Acessando {url} ...")
  req = Request(url, headers=header)
  
  try:
    response = urlopen(req)
    page = response.read()
    soup = BeautifulSoup(page, 'html.parser')

    produtos = soup.find_all('article', class_=lambda c: c and 'ProductCard' in c)
    print(f"🛍️ {len(produtos)} produtos encontrados")

    for produto in produtos:
        # nome
        nome_tag = produto.find('h3', attrs={'data-testid': 'product-card::name'})
        nome = nome_tag.get_text(strip=True) if nome_tag else None

        # preço
        preco_tag = produto.find('strong', attrs={'data-testid': 'product-card::price'})
        preco = preco_tag.get_text(strip=True).replace('R$', '').replace('.', '').replace(',', '.').strip() if preco_tag else None

        # imagem
        imagem_tag = produto.find('img', alt=lambda x: x and 'Imagem' in x)
        imagem = imagem_tag['src'] if imagem_tag else None

        # link
        link_tag = produto.find('a', attrs={'data-testid': 'product-card::card'})
        link = 'https://www.zoom.com.br' + link_tag['href'] if link_tag else None

        if nome and preco and imagem and link:
          print(f"✅ Produto: {nome} — R${preco}")
          cursor.execute(
              'SELECT produto FROM produtos WHERE produto=%s', (nome,)
          )
        if cursor.fetchone() is None:
            cursor.execute(
                'INSERT INTO produtos (produto, valor, imagem, link) VALUES (%s, %s, %s, %s)',
                (nome, preco, imagem, link)
            )
            conexao.commit()
            print(f"   ↳ Inserido no banco.")
        else:
            print(f"   ↳ Já existe no banco.")

        
  except HTTPError as e:
    print(f'HTTP Error: {e.reason}')
  except URLError as e:
    print(f'URL Error: {e.reason}')

cursor.close()
conexao.close()
print("🏁 Finalizado!")