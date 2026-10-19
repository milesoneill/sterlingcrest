import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
afterEach(cleanup);
describe('booking consent policy consistency',()=>{
  it.each([PrivacyPolicy,TermsOfService])('does not infer SMS consent from a phone number or booking',Page=>{
    render(<MemoryRouter><Page/></MemoryRouter>);
    expect(screen.getByText(/does not by itself/)).toBeInTheDocument();
    expect(screen.getByText(/unchecked/)).toBeInTheDocument();
    expect(screen.queryByText(/you expressly consent/)).not.toBeInTheDocument();
    expect(screen.getByText(/affiliates for their marketing or promotional purposes/)).toBeInTheDocument();
  });
});
