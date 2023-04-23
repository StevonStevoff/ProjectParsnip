import * as yup from 'yup';

const EditPlantProfileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  plant_type_id: yup.number().required('Plant type is required'),
  grow_duration: yup.number().required('Grow Duration is required'),
  min: yup.number().required('Minimum is required'),
  max: yup.number().required('Maximum is required'),
  public: yup.boolean().required('Public status is required'),
});

export default EditPlantProfileSchema;
