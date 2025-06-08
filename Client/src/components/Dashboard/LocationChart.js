import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import axios from "../../utils/axiosInstance";
import { getChartOptions } from "../../utils/chart";
import { Box } from '@mui/material';


const LocationChart = () => {
    const [locationData, setLocationData] = useState([]);
    const [country, setCountry] = useState('India');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const fetchLocations = async () => {
          try {
            setLoading(true);
            const locationsRes = await axios.get("/locations");
            setLocationData(locationsRes.data);
            setLoading(false);
          } catch (err) {
            setError("Failed to load location data ", err);
            setLoading(false);
          }
        };
    
        fetchLocations();
      }, []);

    // Aggregate location data by country
    const countryData = useMemo(() => locationData.reduce((acc, loc) => {
        const country = loc.country || "Unknown";
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {}), [locationData]);

    const citiesInCountry = useMemo(() => {

      const cities = [];
      locationData.forEach(loc => {
        if(loc.country === country) {
          cities.push(loc);
        }
      });
      return cities;
    }, [locationData, country]);

    const cityData = useMemo(() => citiesInCountry.reduce((acc, loc) => {
      const city = loc.city || "Unknown";
      acc[city] = (acc[city] || 0) + 1;
      return acc;
  }, {}), [citiesInCountry]);

    const handleCountryClick = (index, label) => {
      setCountry(label);
    }

    // Prepare data for ApexCharts pie chart
    const countrySeries = useMemo(() => Object.values(countryData), [countryData]);
    const citySeries = useMemo(() => Object.values(cityData), [cityData]);


    const countryOptions = useMemo(() => {
      const labels = Object.keys(countryData);
      const options = getChartOptions("Products scanned by Country", labels, handleCountryClick);
      return options;
    } ,[countryData]);

    const cityOptions = useMemo(() => {
      const labels = Object.keys(cityData);
      return getChartOptions("Products scanned by City", labels);
    } ,[cityData]);

      
    return !loading && <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
      {countrySeries?.length > 0 && <Chart options={countryOptions} series={countrySeries} type="pie" height={600} />}
      {citySeries?.length > 0 && <Chart key={`${country}-cities`} options={cityOptions} series={citySeries} type="pie" height={600} />}
      </Box>
}

export default LocationChart;