import xml.etree.ElementTree as ET

def ontener_datos(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    ns = {'ns': 'http://www.uniovi.es'}
    
    # Obtener todas las coordenadas y el ancho de la pista
    coordenadas = []
    ancho_pista = None
    
    for coordenada in root.findall('.//ns:coordenada', ns):
        latitud = float(coordenada.find('ns:latitud', ns).text)
        longitud = float(coordenada.find('ns:longitud', ns).text)
        coordenadas.append((longitud, latitud))
    
    ancho_pista_element = root.find('.//ns:anchoPista', ns)
    if ancho_pista_element is not None:
        ancho_pista = float(ancho_pista_element.text)
    
    return coordenadas, ancho_pista


def generar_svg(coordenadas, ancho_pista):
    # tamaño SVG
    ancho_svg = 800
    alto_svg = 600
    
    # Escalar coordenadas para que se ajusten al tamaño del SVG
    min_x = min([coord[0] for coord in coordenadas])
    max_x = max([coord[0] for coord in coordenadas])
    min_y = min([coord[1] for coord in coordenadas])
    max_y = max([coord[1] for coord in coordenadas])
    
    # Escala simple para ajustar el rango de coordenadas al tamaño del SVG
    escala_x = ancho_svg / (max_x - min_x) if max_x != min_x else 1
    escala_y = alto_svg / (max_y - min_y) if max_y != min_y else 1
    
    # Transformar coordenadas al espacio del SVG
   
    puntos_svg = [
        f"{(longitud - min_x) * escala_x},{alto_svg - (latitud - min_y) * escala_y}"
        for longitud, latitud in coordenadas
    ]
    
    # Generar el contenido del SVG
    ancho_linea = ancho_pista
    nombre = "Red Bull Ring"
    
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{ancho_svg}" height="{alto_svg}">
    "<title>{nombre} </title>"<text x="600" y="30" font-size="20" font-family="Arial" fill="black">{nombre}</text>
<polyline points="{' '.join(puntos_svg)}" style="fill:none;stroke:red;stroke-width:{ancho_linea}" />
</svg>"""
    
    with open('perfil.svg', 'w') as file:
        file.write(svg_content)
    print("SVG generado correctamente.")

# Llamada principal para procesar el archivo XML y generar el SVG
xml_file = 'circuitoEsquema.xml'
coordenadas, ancho_pista = ontener_datos(xml_file)
generar_svg(coordenadas, ancho_pista)
