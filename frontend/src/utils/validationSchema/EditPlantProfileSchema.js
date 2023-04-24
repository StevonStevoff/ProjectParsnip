import * as yup from 'yup';

const EditPlantProfileSchema = (selectedTypes) => yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  plant_type_id: yup.number().required('Plant type is required'),
  grow_duration: yup.number().required('Grow Duration is required'),
  public: yup.boolean().required('Public status is required'),
  properties: yup.object().shape(
    selectedTypes.reduce((schema, property) => ({
      ...schema,
      [property]: yup.object().shape({
        min: yup.number()
          .typeError(`${property} minimum value must be a number`)
          .required(`${property} minimum value is required`),
        max: yup.number()
          .typeError(`${property} maximum value must be a number`)
          .required(`${property} maximum value is required`)
          .min(
            yup.ref('min'),
            `${property} maximum value must be greater than or equal to the minimum value`,
          ),
      }),
    }), {}),
  ),
});

export default EditPlantProfileSchema;
