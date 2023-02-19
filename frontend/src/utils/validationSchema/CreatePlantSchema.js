import * as yup from 'yup';

const RegisterPlantSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    device_id: yup.number().required('Device ID is required'),
    plant_profile_id: yup.number().required('Plant profile ID is required'),
    plant_type_id: yup.number().required('Plant type ID is required'),
  });

  export default RegisterPlantSchema;