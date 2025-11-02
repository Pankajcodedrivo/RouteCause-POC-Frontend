const Result = () => {
    return (
        <div className="card-custom mb-0 pe-0 ps-0">
            <h5>Root Cause Analysis</h5>
            <div className="table-responsive mb-30">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="name">Root Cause</th>
                            <th className="w-sm">Probability</th>
                            <th className="w-md">Contributing Factors</th>
                            <th className="w-md">Root Cause Explanation</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Temperature Variation</td>
                            <td>85%</td>
                            <td>SPC out-of-control points. (3 at &gt; 250 °F), PFMEA (RPN 105), image shows burnt edges</td>
                            <td>
                                Inspect heating elements, insulation, and fans for damage; repair/replace as needed.
                            </td>
                        </tr>
                        <tr>
                            <td>Operator Error</td>
                            <td>10%</td>
                            <td>DFMEA (RPN 120), inconsistent cooking times in PV results</td>
                            <td>
                                Power supply fluctuations — voltage variation causing slower/faster heat-up.
                            </td>
                        </tr>
                        <tr>
                            <td>Improper Loading</td>
                            <td>3%</td>
                            <td>PFMEA (RPN 80), uneven texture in inspection data</td>
                            <td>
                                Operator setup variability — inconsistent setup or fixturing causes uneven contact/pressure.
                            </td>
                        </tr>
                        <tr>
                            <td>Thermostat Failure</td>
                            <td>2%</td>
                            <td>DFMEA (RPN 96), less likely due to low occurrence</td>
                            <td>
                                Limited exposure time — part is active only briefly, reducing opportunity for failure.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h5>Recommendations</h5>
            <div className="term-innr mb-30">
                <p>
                    <strong>Short Term:</strong> Inspect and quarantine all affected batches; hold shipment until root cause verified.
                </p>
                <p>
                    <strong>Long Term:</strong> Update operator training and process checklist to reinforce correct setup and monitoring steps.
                </p>
            </div>
            <h5>Standards / References</h5>
            <div className="term-innr mb-30">
                <ul>
                    <li>
                        <strong>IATF 16949:2016 - Clause 10.2 Corrective Action</strong> (Organizations must take action to eliminate the causes of nonconformities in order to prevent recurrence.)
                    </li>
                    <li>
                        <strong>AIAG FMEA Handbook Reference Section 6 3.2</strong> (Defines how to rate Severity, Occurrence, and Detection to prioritize and manage risk in FMEA.)
                    </li>
                </ul>
            </div>
            <div className="text-center button-group">
                <button className="btn btn-primary">Download Report</button>
                <button className="btn btn-secondary">Send Email</button>
            </div>
        </div>
    );
};

export default Result;