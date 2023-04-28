import * as yup from 'yup';

const EditPlantSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  device_id: yup.number().required('Device is required'),
  plant_profile_id: yup.number().required('Plant profile is required'),
  plant_type_id: yup.number().required('Plant type is required'),
  time_planted: yup.date().optional('Time planted is required'),
  outdoor: yup.boolean().required('Outdoor is required'),
  longitude: yup.number().optional('Longitude is optional').nullable(true),
  latitude: yup.number().optional('Latitude is optional').nullable(true),
});

export default EditPlantSchema;
