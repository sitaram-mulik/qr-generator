import LocationModel from '../models/location.js';
import CampaignModel from '../models/campaign.js';
import geoip from 'geoip-lite';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' assert { type: 'json' };

countries.registerLocale(enLocale);

export const updateLocation = async (req, campaign, code, userId) => {
  try {
    const forwarded = req.headers['x-forwarded-for'];

    //const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress?.replace("::ffff:", "");

    const ip = '45.115.172.0';

    const geo = geoip.lookup(ip);

    if (geo) {
      const countryName = countries.getName(geo.country, 'en') || geo.country;
      const { region, timezone, city, range, ll, area } = geo || {};
      new LocationModel({
        country: countryName,
        region,
        timezone,
        city,
        range: JSON.stringify(range),
        ll: JSON.stringify(ll),
        area,
        campaign,
        userId,
        code
      }).save();
    } else {
      new LocationModel({
        country: 'unknown',
        campaign,
        userId,
        code
      }).save();
    }
  } catch (error) {
    console.log('Error while updating location data ', error);
  }
};
