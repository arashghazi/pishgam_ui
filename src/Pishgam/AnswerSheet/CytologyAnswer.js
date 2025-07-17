import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import {
  SPECIMEN_ADEQUACY_OPTIONS,
  ADEQUACY_DETAIL_OPTIONS,
  UNSAT_REASON_OPTIONS,
  INTERPRETATION_BRANCH_OPTIONS,
  ORGANISMS_OPTIONS,
  NON_NEOPLASTIC_OPTIONS,
  SQUAMOUS_ABNORMALITY_OPTIONS,
  GLANDULAR_ABNORMALITY_OPTIONS,
  OTHER_MALIGNANT_OPTION
} from './cytologyOptions';
import FormManager from '../../EngineForms/FormManager';
import BaseInstance, { NewInstance } from '../../Engine/BaseInstance';
import ConditionMaker from '../../Engine/ConditionMaker';

export default function CytologyAnswer() {
  const HeaderForm = 'O30E12C131F0V1';
  const [saving, setSaving] = useState(false);
  const [instance, setInstance] = useState(NewInstance('O30E12C131'));
  const [labratoary, setLabratoary] = useState();
  const [sample, setSample] = useState();
  const [specimenAdequacy, setSpecimenAdequacy] = useState('');
  const [detailId, setDetailId] = useState('');

  const [interpretationBranch, setInterpretationBranch] = useState('');
  const [organismIds, setOrganismIds] = useState([]);
  const [nonNeoplasticIds, setNonNeoplasticIds] = useState([]);
  const [squamousId, setSquamousId] = useState('');
  const [glandularId, setGlandularId] = useState('');
  const [otherMalignantChecked, setOtherMalignantChecked] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location?.state?.values?.length > 0) {
      setSample(location.state.values[0].value);
      setLabratoary(location.state.values[1].value)
    }
  }, [])
  useEffect(() => {
    const loaadDoc = async () => {
      await Loader();
    }
    if (labratoary && sample)
      loaadDoc();
  }, [labratoary, sample])
  useEffect(() => {
    fillObjects();
  }, [instance])
  const handleCheckboxList = (id, list, setter) => {
    if (list.includes(id)) setter(list.filter(i => i !== id));
    else setter([...list, id]);
  };

  const handleSpecimenChange = (id) => {
    setSpecimenAdequacy(id);
    setDetailId('');
    // reset interpretation
    if (id !== SPECIMEN_ADEQUACY_OPTIONS.find(o => o.value === 'satisfactory').id) {
      setInterpretationBranch('');
      setOrganismIds([]);
      setNonNeoplasticIds([]);
      setSquamousId('');
      setGlandularId('');
      setOtherMalignantChecked(false);
    }
  };

  const handleInterpretationChange = (id) => {
    setInterpretationBranch(id);
    setOrganismIds([]);
    setNonNeoplasticIds([]);
    setSquamousId('');
    setGlandularId('');
    setOtherMalignantChecked(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    var baseins = new BaseInstance(instance);
    baseins.SetValue('P230', specimenAdequacy, 0);
    baseins.SetValue('P231', detailId, 0);
    baseins.SetValue('P232', interpretationBranch, 0);
    baseins.SetValue('P233', (organismIds??[]).map(item => `"${item}"`).join(','), 0);
    baseins.SetValue('P234', (nonNeoplasticIds??[]).map(item => `"${item}"`).join(','), 0);
    baseins.SetValue('P235', squamousId, 0);
    baseins.SetValue('P236', glandularId, 0);
    baseins.SetValue('P237', otherMalignantChecked, 0);
    await baseins.SaveAsync();
    setSaving(false);
  };
  const fillObjects = () => {
    var baseins = new BaseInstance(instance);
    console.log(instance)
    setSpecimenAdequacy(baseins.GetValue('P230'));
    setDetailId(baseins.GetValue('P231'))
    setInterpretationBranch(baseins.GetValue('P232'))
    setOrganismIds(baseins.GetValue('P233'))
    setNonNeoplasticIds(baseins.GetValue('P234'))
    setSquamousId(baseins.GetValue('P235'))
    setGlandularId(baseins.GetValue('P236'))
    setOtherMalignantChecked(baseins.GetValue('P237'))
  };
  const isSatisfactory = SPECIMEN_ADEQUACY_OPTIONS.find(o => o.value === 'satisfactory').id === specimenAdequacy;
  const Loader = async () => {
    if (sample && labratoary) {
      let cond = new ConditionMaker('O30E12C131');
      cond.AddCondition('P8', '=', labratoary.id, 'And')
        .AddCondition('P9', '=', sample.id);
      var result = await cond.GetResult();
      if (result && result.length > 0) {
        setInstance(result[0]);
      }
      else {
        var temp = new BaseInstance(NewInstance('O30E12C131'));
        var tempOld = new BaseInstance(instance);

        temp.SetValue('PC363', tempOld.GetValue('PC363', true))
        temp.SetValue('PC27', tempOld.GetValue('PC27', true))
        temp.SetValue('P8', labratoary)
        temp.SetValue('P9', sample)
        setInstance(temp.Instance)
      }
    }
  }
  return (
    <FormManager title='فرم ثبت نتایج افتراقی گلبول های سفید، مرفولوژی سلولی و تشخیص های احتمالی'
      Data={[{ formId: HeaderForm, data: instance }]}
      onChange={(value, pid) => {
        if (value !== undefined && pid === 'P8') {
          setLabratoary(value);
        }
        if (value !== undefined && pid === 'P9') {
          setSample(value);
        }
      }}
      IsPanel={true} formId={HeaderForm} >
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4} xs={12} className="mb-3">
            <FormGroup tag="fieldset">
              <legend className="font-weight-bold">Specimen Adequacy</legend>
              {SPECIMEN_ADEQUACY_OPTIONS.map(opt => (
                <FormGroup check key={opt.id}>
                  <Label check>
                    <Input
                      type="radio"
                      name="specimenAdequacy"
                      value={opt.id}
                      checked={specimenAdequacy === opt.id}
                      onChange={() => handleSpecimenChange(opt.id)}
                    />{' '}
                    {opt.display}
                  </Label>
                </FormGroup>
              ))}

              {isSatisfactory && (
                <div className="pl-3 mt-2">
                  {ADEQUACY_DETAIL_OPTIONS.map(opt => (
                    <FormGroup check key={opt.id}>
                      <Label check>
                        <Input
                          type="radio"
                          name="adequacyDetail"
                          value={opt.id}
                          checked={detailId === opt.id}
                          onChange={() => setDetailId(opt.id)}
                        />{' '}
                        {opt.display}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              )}

              {!isSatisfactory && specimenAdequacy && (
                <div className="pl-3 mt-2">
                  {UNSAT_REASON_OPTIONS.map(opt => (
                    <FormGroup check key={opt.id}>
                      <Label check>
                        <Input
                          type="radio"
                          name="unsatReason"
                          value={opt.id}
                          checked={detailId === opt.id}
                          onChange={() => setDetailId(opt.id)}
                        />{' '}
                        {opt.display}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              )}
            </FormGroup>
          </Col>

          <Col md={8} xs={12} className="mb-3">
            <FormGroup tag="fieldset">
              <legend className="font-weight-bold">Interpretation / Result</legend>
              {INTERPRETATION_BRANCH_OPTIONS.map(opt => (
                <FormGroup check key={opt.id}>
                  <Label check>
                    <Input
                      type="radio"
                      name="interpretationBranch"
                      value={opt.id}
                      disabled={!isSatisfactory}
                      checked={interpretationBranch === opt.id}
                      onChange={() => handleInterpretationChange(opt.id)}
                    />{' '}
                    {opt.display}
                  </Label>
                </FormGroup>
              ))}

              {isSatisfactory && interpretationBranch === INTERPRETATION_BRANCH_OPTIONS.find(o => o.value === 'negative').id && (
                <div className="pl-3 mt-2">
                  <FormGroup>
                    <Label className="font-weight-bold d-block">Organisms</Label>
                    {ORGANISMS_OPTIONS.map(opt => (
                      <FormGroup check key={opt.id}>
                        <Label check>
                          <Input
                            type="checkbox"
                            value={opt.id}
                            checked={organismIds?.includes(opt.id)}
                            onChange={() => handleCheckboxList(opt.id, organismIds, setOrganismIds)}
                          />{' '}
                          {opt.display}
                        </Label>
                      </FormGroup>
                    ))}
                  </FormGroup>
                  <FormGroup>
                    <Label className="font-weight-bold d-block">Other non-neoplastic findings</Label>
                    {NON_NEOPLASTIC_OPTIONS.map(opt => (
                      <FormGroup check key={opt.id}>
                        <Label check>
                          <Input
                            type="checkbox"
                            value={opt.id}
                            checked={nonNeoplasticIds?.includes(opt.id)}
                            onChange={() => handleCheckboxList(opt.id, nonNeoplasticIds?? [], setNonNeoplasticIds)}
                          />{' '}
                          {opt.display}
                        </Label>
                      </FormGroup>
                    ))}
                  </FormGroup>
                </div>
              )}

              {isSatisfactory && interpretationBranch === INTERPRETATION_BRANCH_OPTIONS.find(o => o.value === 'epithelial').id && (
                <div className="pl-3 mt-2">
                  <FormGroup>
                    <Label className="font-weight-bold d-block">Squamous Cell Abnormality</Label>
                    {SQUAMOUS_ABNORMALITY_OPTIONS.map(opt => (
                      <FormGroup check key={opt.id}>
                        <Label check>
                          <Input
                            type="radio"
                            name="squamousAbnormality"
                            value={opt.id}
                            checked={squamousId === opt.id}
                            onChange={() => setSquamousId(opt.id)}
                          />{' '}
                          {opt.display}
                        </Label>
                      </FormGroup>
                    ))}
                  </FormGroup>
                  <FormGroup>
                    <Label className="font-weight-bold d-block">Glandular Cell Abnormality</Label>
                    {GLANDULAR_ABNORMALITY_OPTIONS.map(opt => (
                      <FormGroup check key={opt.id}>
                        <Label check>
                          <Input
                            type="radio"
                            name="glandularAbnormality"
                            value={opt.id}
                            checked={glandularId === opt.id}
                            onChange={() => setGlandularId(opt.id)}
                          />{' '}
                          {opt.display}
                        </Label>
                      </FormGroup>
                    ))}
                  </FormGroup>
                </div>
              )}

              {isSatisfactory && interpretationBranch === INTERPRETATION_BRANCH_OPTIONS.find(o => o.value === 'otherMalignant').id && (
                <div className="pl-3 mt-2">
                  {OTHER_MALIGNANT_OPTION.map(opt => (
                    <FormGroup check key={opt.id}>
                      <Label check>
                        <Input
                          type="checkbox"
                          value={opt.id}
                          checked={otherMalignantChecked}
                          onChange={() => setOtherMalignantChecked(!otherMalignantChecked)}
                        />{' '}
                        {opt.display}
                      </Label>
                    </FormGroup>
                  ))}
                </div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Button disabled={saving} type="submit" color="primary">ذخیره</Button>
      </Form>
    </FormManager>
  );
}