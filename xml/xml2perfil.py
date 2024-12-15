import xml.etree.ElementTree as ET

# Función para obtener altitudes y el ancho de la pista
def obtener_datos(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    ns = {'ns': 'http://www.uniovi.es'}
    
    # Obtener todas las altitudes
    altitudes = []
    tramos = []
    
    for altitud in root.findall('.//ns:coordenada', ns):
        altitud_value = float(altitud.find('ns:altitud', ns).text)
        altitudes.append(altitud_value)

    # Generar nombres de tramos
    for i in range(len(altitudes)):
        tramos.append("Tramo " + str(i + 1))


    return altitudes, tramos

# Función para generar el SVG
def generar_svg(altitudes, tramos):
    # Tamaño del SVG
    ancho_svg_total = 1000
    ancho_svg = 800
    alto_svg = 600

    # Generar los puntos de la polilínea para crear los picos
    puntos_svg = []
    for i in range(len(altitudes)):
        x = i * (ancho_svg / (len(altitudes) - 1)) +100  # Espaciar los puntos uniformemente
        y = (alto_svg - (altitudes[i] / max(altitudes)) * (alto_svg-50)) *2   # Ajustar la altura
        puntos_svg.append(f"{x},{y}")  # Agregar cada punto

    # Cerrar el gráfico conectando el último punto con el primer punto
    puntos_svg.append(puntos_svg[0])  # Agregar el primer punto al final

    # Comprobar si se generaron puntos
    if not puntos_svg:
        print("No se generaron puntos para la polilínea.")
        return

    # Contenido del SVG
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{ancho_svg_total}" height="{alto_svg}">
    <polyline points="{' '.join(puntos_svg)}" style="fill:white;stroke:red;stroke-width:{4}" />"""

    # Posición fija para las etiquetas de los tramos

    # Agregar nombres de tramos debajo de la gráfica
    for i, punto in enumerate(puntos_svg[:-1]):  # No agregar el último punto (es un duplicado)
        x, _ = punto.split(',')
        x = float(x)
        svg_content += f'<text x="{x}" y="{220}" style="writing-mode : tb; glyph-orientation-vertical : 0">{tramos[i]}</text>\n'

    svg_content += "</svg>"
    
    # Guardar el archivo SVG
    with open('planimetria.svg', 'w') as file:
        file.write(svg_content)
    print("SVG generado correctamente.")

# Llamada principal para procesar el archivo XML y generar el SVG
xml_file = 'circuitoEsquema.xml'
altitudes, tramos = obtener_datos(xml_file)
generar_svg(altitudes, tramos)


