import * as yup from 'yup';

const EditPlantProfileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  plant_type_id: yup.number().required('Plant type ID is required'),
  lower_limit: yup.number().required('Lower Limit is required'),
  higher_limit: yup.number().required('Higher Limit is required'),
  public: yup.boolean().required('Public status is required'),
});

export default EditPlantProfileSchema;
