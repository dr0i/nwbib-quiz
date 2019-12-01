IFS=$'\n'
rm wikidataGndConcordance.csv
# get all wikidata city entities:
for i in $(cat ../../../places.geojson | jq '.features[].properties|.id,.label' | paste - - ); do
	# get top ten of the subjects of resources with focus of the wikidata city:
 cityWikidataId=$(echo $i | cut -d '"' -f2)
 cityName=$(echo $i | cut -d '"' -f4)
	echo "cityName=-$cityName-"
	for subject in $(curl -L "https://lobid.org/resources/search?format=json&aggregations=subject.componentList.id&q=spatial.focus.id:$i" 2>/dev/null| jq .aggregation  |grep gnd |head -n10 | sed 's#.*gnd/\(.*\)"#\1#g') ; do
	# heuristic: find the best subject
		subjectName=$(curl -L --header "accept: application/json" "http://lobid.org/gnd/$subject" |jq .preferredName |
		sed 's#^"\(.*\)-.*#\1#g'  | #word composita
		sed 's#(.*)##g' | sed 's#"##g' | sed 's# ##g')  #all words in brackets
echo "subject=-$subject-"
echo "subjectName=-$subjectName-"
		if [ "$subjectName" != "$cityName" ]; then
			echo "ungleich!"
			depiction=$(curl -L --header "accept: application/json" "http://lobid.org/gnd/$subject" | jq .depiction[].thumbnail)
			echo "$cityWikidataId,$cityName,$subject,$depiction"
			echo "$cityWikidataId,$cityName,$subject,$depiction" >> wikidataGndConcordance.csv
			break
		fi
	done
done
