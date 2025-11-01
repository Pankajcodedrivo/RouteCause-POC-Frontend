import upload from '../assets/images/feather_upload-cloud.svg'
import pdf from '../assets/images/pdf.svg'
import doc from '../assets/images/doc.svg'
import cross from '../assets/images/cross.svg'
import image from '../assets/images/image.svg'
const AnalysisForm = () => {
    return (
        <div className="card-custom">
            <div className="upload-box mb-20">
                <input type="file" className="input-file" name="" id="" />
                <span className="upload-icon"><img src={upload} alt="" /></span>
                <h6>Upload Document *</h6>
                <p>
                    Upload file in pdf, docx, or txt format — up to 5 MB only.
                </p>
                <button className="btn btn-primary sm">Select File</button>
            </div>

            <div className="mb-20">
                <p className="upload-txt"><span><img src={pdf} alt="" /></span> your file here.pdf <em><img src={cross} alt="" /></em></p>
                <p className="upload-txt"><span><img src={doc} alt="" /></span> your file here.docx <em><img src={cross} alt="" /></em></p>
            </div>

            <div className="mb-20">
                <label className="form-label">Description *</label>
                <textarea
                    className="form-control"
                    placeholder="Enter a short description of the problem..."
                ></textarea>
            </div>

            <div className="upload-box flex mb-20">
                <input type="file" className="input-file" name="" id="" />
                <span className="upload-icon"><img src={upload} alt="" /></span>
                <div>
                    <h6>Upload Photo (Optional)</h6>
                    <p>
                        Upload files in .jpg or .png format — up to 5 MB only.
                    </p>
                </div>
                <button className="btn btn-primary sm">Select File</button>
            </div>

            <div className="mb-30">
                <p className="upload-txt"><span><img src={image} alt="" /></span> your file here.jpg <em><img src={cross} alt="" /></em></p>
                <p className="upload-txt"><span><img src={image} alt="" /></span> your file here.jpg <em><img src={cross} alt="" /></em></p>
                <p className="upload-txt"><span><img src={image} alt="" /></span> your file here.jpg <em><img src={cross} alt="" /></em></p>
            </div>

            <div className="text-center">
                <button className="btn btn-primary w-100">Generate Root Cause</button>
            </div>
        </div>
    );
};

export default AnalysisForm;