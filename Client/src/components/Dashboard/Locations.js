import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from '../../utils/axiosInstance';
import { getChartOptions } from '../../utils/chart';
import { Box, Paper } from '@mui/material';
import Map from '../Lib/Map';
import LocationsBarCharts from './LocationsBarCharts';

const Locations = ({ selectedCampaign }) => {
  const [locationData, setLocationData] = useState([]);
  const [country, setCountry] = useState('India');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locationsRes = await axios.get(`/locations?campaign=${selectedCampaign}`);
        console.log('locationsRes.data ', locationsRes.data);
        const _locations = [...locationsRes.data].filter(
          ({ country }) => !country || country !== 'unknown'
        );

        setLocationData(_locations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load location data ', err);
        setLoading(false);
      }
    };

    fetchLocations();
  }, [selectedCampaign]);

  // Aggregate location data by country
  const countryData = useMemo(
    () =>
      locationData.reduce((acc, loc) => {
        const country = loc.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}),
    [locationData]
  );

  const citiesInCountry = useMemo(() => {
    const cities = [];
    locationData.forEach(loc => {
      if (loc.country === country) {
        cities.push(loc);
      }
    });
    return cities;
  }, [locationData, country]);

  const coordinates = useMemo(() => {
    const _coordinates = [];
    locationData.forEach(loc => {
      if (!loc.ll) return; // Skip if no coordinates
      const [lat, lng] = JSON.parse(loc.ll);
      _coordinates.push({ lat, lng });
    });
    console.log('Coordinates for map:', _coordinates);
    return _coordinates || [];
  }, [locationData]);

  const cityData = useMemo(
    () =>
      citiesInCountry.reduce((acc, loc) => {
        const city = loc.city || 'Unknown';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {}),
    [citiesInCountry]
  );

  const handleCountryClick = (index, label) => {
    setCountry(label);
  };

  // Prepare data for ApexCharts pie chart
  const countrySeries = useMemo(() => Object.values(countryData), [countryData]);
  const citySeries = useMemo(() => Object.values(cityData), [cityData]);

  const countryOptions = useMemo(() => {
    const labels = Object.keys(countryData);
    const options = getChartOptions(
      'pie',
      'Products scanned by Country',
      labels,
      handleCountryClick
    );
    return options;
  }, [countryData]);

  const cityOptions = useMemo(() => {
    const labels = Object.keys(cityData);
    return getChartOptions('pie', 'Products scanned by City', labels);
  }, [cityData]);

  // Prepare top 5 countries and cities for bar charts
  const topCountries = useMemo(() => {
    const entries = Object.entries(countryData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
    return entries;
  }, [countryData]);

  const topCities = useMemo(() => {
    const entries = Object.entries(cityData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
    return entries;
  }, [cityData]);

  return (
    !loading && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Paper sx={{ p: 2, flexBasis: '50%' }}>
            {coordinates.length > 0 && (
              <>
                <h3>Scan locations</h3>
                <Map locations={coordinates} />
              </>
            )}
          </Paper>
          <Paper
            sx={{
              p: 2,
              flexBasis: '45%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {countrySeries?.length > 0 && (
              <Chart options={countryOptions} series={countrySeries} type="pie" height={600} />
            )}
            {citySeries?.length > 0 && (
              <Chart
                key={`${country}-cities`}
                options={cityOptions}
                series={citySeries}
                type="pie"
                height={600}
              />
            )}
          </Paper>
        </Box>
        <LocationsBarCharts topCountries={topCountries} topCities={topCities} />
      </Box>
    )
  );
};

export default Locations;
