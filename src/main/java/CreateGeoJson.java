
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
    private static BufferedWriter writer;
    private static boolean firstEntry = true;

    public static void main(String... args) {
        try {
            List<Map<String, String>> csv = read(
                    new File("/home/pc/git/nwbib-quiz/src/main/resources/places.csv"));
            writer = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream("places.geojson"), StandardCharsets.UTF_8));
            writer.write(geoJsonHead);
            csv.forEach(en -> {
                getJsonEntry(en);
            });
            writer.write("\n]}");
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static List<Map<String, String>> read(File file)
            throws JsonProcessingException, IOException {
        List<Map<String, String>> response = new LinkedList<Map<String, String>>();
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = CsvSchema.emptySchema().withHeader();
        MappingIterator<Map<String, String>> iterator = mapper.readerFor(Map.class).with(schema)
                .readValues(file);
        while (iterator.hasNext()) {
            response.add(iterator.next());
        }
        System.out.println(response.toString());
        return response;
    }

    // @formatter:off
    static String geoJsonHead="{\n"+""
            + "  \"type\": \"FeatureCollection\",\n"
            +"  \"features\": [\n";
        static String geoJsonEntry = //
                      "{\n" +
                      "      \"type\": \"Feature\",\n" +
                      "      \"geometry\": {\n" +
                      "        \"type\": \"Point\",\n" +
                      "        \"coordinates\": [%s]\n" +
                      "      },\n" +
                      "      \"properties\": {\n" +
                      "        \"label\": \"%s\",\n" +
                      "        \"id\": \"%s\",\n" +
                      "        \"pop\": \"%s\",\n" +
                      "        \"depiction\": \"%s\"\n" +
                      "}}";
    // @formatter:on
    private static void getJsonEntry(Map<String, String> e) {
        try {
            if (!firstEntry)
                writer.write(",");
            writer.write(String.format(geoJsonEntry,
                    e.get("location").replaceAll("Point\\((.*) (.*)\\)", "$1,$2"),
                    e.get("cityLabel"), e.get("city"), e.get("pop").replaceAll("\\..*$", ""),
                    e.get("img")));
            firstEntry = false;
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }

}
