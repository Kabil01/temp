import React from 'react';
import './css/timeline.css';

function TimelineCamp() {
    return (
        <section className="experience pt-100 pb-100" id="experience">
            <div className="container">
                <div className="row">
                    <div className="col-xl-8 mx-auto text-center">
                        <div className="section-title">
                            <h4>NSS CAMP DETAILS</h4>
                            <p>For the academic year 2022-2023</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12">
                        <ul className="timeline-list">
                            {/* Single Experience */}
                            <li>
                                <div className="timeline_content">
                                    <span>2022-04-02</span>
                                    <h4>Campaign</h4>
                                    <p>Conducted a voting Awareness Campaign on Redhills</p>
                                </div>
                            </li>
                            {/* Single Experience */}
                            <li>
                                <div className="timeline_content">
                                    <span></span>
                                    <h4>Junior Developer</h4>
                                    <p>We gather your business and products information. We then determine the direction of the project and understand your goals and we combine your ideas with ours for an amazing website.</p>
                                </div>
                            </li>
                            {/* Single Experience */}
                            <li>
                                <div className="timeline_content">
                                    <span>2012-2015</span>
                                    <h4>Senior Developer</h4>
                                    <p>We gather your business and products information. We then determine the direction of the project and understand your goals and we combine your ideas with ours for an amazing website.</p>
                                </div>
                            </li>
                            {/* Single Experience */}
                            <li>
                                <div className="timeline_content">
                                    <span>2015-2018</span>
                                    <h4>Project Manager</h4>
                                    <p>We gather your business and products information. We then determine the direction of the project and understand your goals and we combine your ideas with ours for an amazing website.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TimelineCamp;
