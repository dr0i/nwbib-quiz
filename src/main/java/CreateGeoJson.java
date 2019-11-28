/* Copyright 2019 hbz, Pascal Christoph. Licensed under the EPL 2.0*/

import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/* Parses the places.csv and generates a geojson file out if.
 * The output can be used to visualize the data on a map using e.g. javascript leaflet.
 * 
 * @author: dr0i
 */
public class CreateGeoJson {
    private static BufferedWriter placesWriter;

    private static boolean firstEntry = true;

    public static void main(String... args) {
        try {
            List<Map<String, String>> csv = read(
                    new File("src/main/resources/places.csv"));
            placesWriter = new BufferedWriter(new OutputStreamWriter(
                    new FileOutputStream("places.geojson"), StandardCharsets.UTF_8));
            placesWriter.write(geoJsonHead);
            csv.forEach(en -> {
                getJsonEntry(en);
            });
            placesWriter.write("\n]}");
            placesWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static List<Map<String, String>> read(File file)
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
                placesWriter.write(",");
            placesWriter.write(String.format(geoJsonEntry,
                    e.get("location").replaceAll("Point\\((.*) (.*)\\)", "$1,$2"),
                    e.get("cityLabel"), e.get("city"), e.get("pop").replaceAll("\\..*$", ""),
                    loadAndScaleAndWriteCityImage(e.get("img"))));
            firstEntry = false;
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }

    /**
     * Resizes an image to a fix width, proportionally. Store it locally.
     * 
     * @param inputImageUrl Url of the original image
     * @return new local path
     * @throws IOException
     */
    private static String loadAndScaleAndWriteCityImage(final String inputImageUrl) {
        BufferedImage inputImage;
        String scaledImageFn = "";
        try {
            inputImage = ImageIO.read(getFinalURL(inputImageUrl));
            BufferedImage scaledImage = imageToBufferedImage(
                    inputImage.getScaledInstance(400, -1, Image.SCALE_SMOOTH));
            // writes to output file
            scaledImageFn = "images/" + inputImageUrl.replaceAll(".*/", "").replaceAll("%", "");
            ImageIO.write(scaledImage, "jpg", new File(scaledImageFn));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return scaledImageFn;
    }

    private static BufferedImage imageToBufferedImage(Image im) {
        BufferedImage bi = new BufferedImage(im.getWidth(null), im.getHeight(null),
                BufferedImage.TYPE_INT_RGB);
        Graphics bg = bi.getGraphics();
        bg.drawImage(im, 0, 0, null);
        bg.dispose();
        return bi;
    }

    private static URL getFinalURL(String url) throws IOException {
        HttpURLConnection con = (HttpURLConnection) new URL(url).openConnection();
        con.setInstanceFollowRedirects(false);
        con.connect();
        con.getInputStream();
        if (con.getResponseCode() == HttpURLConnection.HTTP_MOVED_PERM
                || con.getResponseCode() == HttpURLConnection.HTTP_MOVED_TEMP) {
            String redirectUrl = con.getHeaderField("Location");
            return getFinalURL(redirectUrl);
        }
        return new URL(url);
    }

}
