/* Copyright 2019 hbz, Pascal Christoph. Licensed under the EPL 2.0*/
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/* Parses the places.csv and generates a geojson file out if.
 * The output can be used like in "map.html" to visualize the data on a map.
 * 
 * @author: dr0i
 */
public class CreateGeoJson {
//    static HashMap<String, HashMap<String>> ortMap = new HashMap<>();
    private static BufferedWriter writer ;
    private static String getUriTitelHref(final String ID_URI, final String TITEL) {
        return "</br><a href=\\\"" + ID_URI + "\\\">\\\"" + TITEL + "\\\"</a>";
    }

    public static void main(String... args) {
        try {
            List<Map<String, String>> csv= read (new File("/home/pc/git/nwbib-quiz/src/main/resources/places.csv"));
            writer= new BufferedWriter(new OutputStreamWriter(new FileOutputStream("places.geojson"), StandardCharsets.UTF_8));
           
            csv.forEach( en -> {
                    getJsonEntry(en);
            } );
            writer.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
        public static List<Map<String, String>> read(File file) throws JsonProcessingException, IOException {
            List<Map<String, String>> response = new LinkedList<Map<String, String>>();
            CsvMapper mapper = new CsvMapper();
            CsvSchema schema = CsvSchema.emptySchema().withHeader();
            MappingIterator<Map<String, String>> iterator = mapper.reader(Map.class)
                    .with(schema)
                    .readValues(file);
            while (iterator.hasNext()) {
                response.add(iterator.next());
            }
            System.out.println(response.toString());
            return response;
        }
        

    // @formatter:off
    static String geoJsonHead = 
          "{\n" +
          "  \"type\": \"FeatureCollection\",\n" +
          "  \"features\": [\n";
    static String geoJsonEntry = //
          "{\n" +
          "      \"type\": \"Feature\",\n" +
          "      \"geometry\": {\n" +
          "        \"type\": \"Point\",\n" +
          "        \"coordinates\": [%s]\n" +
          "      },\n" +
          "      \"properties\": {\n" +
          "        \"ort\": \"%s\",\n" +
          "        \"target\": \"%s\"\n" +
          "}}";

    // @formatter:on
    private static void getJsonEntry(Map<String, String> e) {
        try {
            writer.write(String.format(geoJsonEntry,  e.get("location"),e.get("cityLabel"),
                    e.get("city")));
        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
    }

  
}
