import xml.etree.ElementTree as ET

class Kml:
    """
    Genera archivo KML con puntos y líneas
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz, 'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc,'name').text = '\n' + nombre + '\n'
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n' 

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = '\n' + color + '\n'
        ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self, nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def leerCoordenadas(xml_file):
    """
    Procesa un XML de entrada y genera una lista de coordenadas
    """
    # Cargar el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Namespace
    ns = {'c': 'http://www.uniovi.es'}
    coordenadas = []
    coordenada_salida = root.find('.//c:coordenadasSalida', ns)
    if coordenada_salida is not None:
        coordenada = coordenada_salida.find('c:coordenada', ns)
        longitud_salida = coordenada.find('c:longitud', ns).text
        latitud_salida = coordenada.find('c:latitud', ns).text
        coordenadas.append((longitud_salida, latitud_salida))
    
    # Leer los tramos y formatear las coordenadas
    tramos = root.findall('.//c:tramo', ns)
    for tramo in tramos:
        coordenada = tramo.find('c:coordenada', ns)
        if coordenada is not None:
            longitud = coordenada.find('c:longitud', ns).text
            latitud = coordenada.find('c:latitud', ns).text
            coord = longitud, latitud
            coordenadas.append(coord)

    return coordenadas

def main():
    xml_file = 'circuitoEsquema.xml'
    kml_file = 'circuito.kml'
    kml = Kml()

    coordenadas = leerCoordenadas(xml_file)
    coordenadas_str = ""
    tramo = 0
    for  coordenada in coordenadas:
        longitud,latitud = coordenada
        tramo+=1
        kml.addPlacemark(f'Tramo: {tramo}', 'Red Bull Ring', longitud, latitud, 0.0, 'relativeToGround')
        coordenadas_str += f'{longitud.strip()},{latitud.strip()},0.0\n'

    # Agregar la línea de todos los tramos
    kml.addLineString("Red Bull Ring", "1", "1", coordenadas_str, 'relativeToGround', '#ff0000ff', '5')

    # Escribir el archivo KML
    kml.escribir(kml_file)

    print("KML generado:", kml_file)

if __name__ == "__main__":
    main()
