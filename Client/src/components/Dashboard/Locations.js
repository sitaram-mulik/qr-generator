import { useEffect, useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import axios from '../../utils/axiosInstance';
import { getChartOptions } from '../../utils/chart';
import { Box, Grid, Paper } from '@mui/material';
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
        const _locations = [...locationsRes.data];
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
        const country = !loc.country || loc.country === 'unknown' ? 'Anonymous' : loc.country;
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}),
    [locationData]
  );

  const cityData = useMemo(
    () =>
      locationData
        .filter(loc => loc.city)
        .reduce((acc, loc) => {
          const city = loc.city || 'Anonymous';
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {}),
    [locationData]
  );

  // const citiesInCountry = useMemo(() => {
  //   const cities = [];
  //   locationData.forEach(loc => {
  //     if (loc.country === country && loc.city) {
  //       cities.push(loc);
  //     }
  //   });
  //   return cities;
  // }, [locationData, country]);

  const coordinates = useMemo(() => {
    const _coordinates = [];
    locationData.forEach(loc => {
      if (!loc.ll) return; // Skip if no coordinates
      const [lat, lng] = JSON.parse(loc.ll);
      _coordinates.push({ lat, lng });
    });
    return _coordinates || [];
  }, [locationData]);

  // const cityData = useMemo(
  //   () =>
  //     citiesInCountry.reduce((acc, loc) => {
  //       const city = loc.city;
  //       acc[city] = (acc[city] || 0) + 1;
  //       return acc;
  //     }, {}),
  //   [citiesInCountry]
  // );

  // Prepare top 5 countries and cities for bar charts
  const topCountries = useMemo(() => {
    const entries = Object.entries(countryData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
    return entries;
  }, [countryData]);

  const topCities = useMemo(() => {
    console.log('cityData ', cityData);
    const entries = Object.entries(cityData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([city, count]) => ({ city, count }));
    return entries;
  }, [cityData]);

  return (
    !loading &&
    coordinates.length > 0 && (
      <>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 2
            }}
          >
            <h3>Scan locations</h3>
            <Map locations={coordinates} />
          </Paper>
        </Grid>
        <LocationsBarCharts topCountries={topCountries} topCities={topCities} />

        {/* <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 2,
              display: 'inline-flex',
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
        </Grid> */}
      </>
    )
  );
};

export default Locations;
