import { render, screen, fireEvent, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogPage from '@/templates/BlogPage';
import { getSeoPageByPath } from '@/lib/seo-content';
const quote=getSeoPageByPath('/resources/final-expense-insurance-quote-checklist')!;
function show(page=quote){return render(<MemoryRouter><BlogPage page={page}/></MemoryRouter>);}
it('gives the selected guide a working six-item checklist with accessible labels and progress',()=>{
 show();const checks=screen.getAllByRole('checkbox');expect(checks).toHaveLength(6);expect(screen.getByText('0 of 6 checked')).toBeInTheDocument();
 fireEvent.click(checks[0]);expect(checks[0]).toBeChecked();expect(screen.getByText('1 of 6 checked')).toBeInTheDocument();fireEvent.click(checks[0]);expect(screen.getByText('0 of 6 checked')).toBeInTheDocument();
});
it('connects every section link to content, preserves six FAQ answers and makes the example table keyboard accessible',()=>{
 const {container}=show();const toc=screen.getByRole('navigation',{name:'Article sections'});
 for(const link of within(toc).getAllByRole('link'))expect(container.querySelector(link.getAttribute('href')!)).not.toBeNull();
 expect(container.querySelectorAll('.eg-faq details')).toHaveLength(6);expect(screen.getByRole('region',{name:/Example planning notes/})).toHaveAttribute('tabindex','0');
 const faqSchema=quote.frontmatter.schema?.find((s:unknown)=>typeof s==='object'&&s!==null&&'@type' in s&&s['@type']==='FAQPage') as {'mainEntity':{name:string}[]};expect(faqSchema.mainEntity.map(q=>q.name)).toEqual(quote.faq.map(f=>f.question));
});
it('uses the approved readable layout for other articles without rewriting their content',()=>{
 const other=getSeoPageByPath('/resources/prepare-final-expense-insurance-application')!;expect(other.frontmatter.guideLayout).toBeUndefined();const {container}=show(other);expect(container.querySelector('.editorial-guide')).not.toBeNull();expect(screen.getAllByRole('link',{name:'Schedule a consultation'})).toHaveLength(2);expect(screen.getByRole('heading',{level:1})).toHaveTextContent(other.frontmatter.title);
});
