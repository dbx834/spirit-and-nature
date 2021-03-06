// ----------------------------------------------------------------------------
// -------------------------------------------------------------------- Imports
// ----------------------------------------------------------------------------
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Libraries
import React from "react";
import PropTypes from "prop-types";
import { css } from "glamor";
import moment from "moment";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Lodash
import trim from "lodash/trim";
import last from "lodash/last";
import split from "lodash/split";
import isNull from "lodash/isNull";
import startsWith from "lodash/startsWith";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Components
import Link from "gatsby-link";
import FacebookProvider, { Like as FBLike } from "react-facebook";
import {
  Page,
  // Section,
  Article,
  Header,
  Footer,
} from "@bodhi-project/semantic-webflow";
import { Elements } from "@bodhi-project/typography";
import { treeCodeParser } from "@bodhi-project/markdown-to-react";
import {
  // --------------- Basic
  UpdateTitle,
  GeneralMeta,
  // --------------- Twitter
  TwitterSummaryCard,
  // --------------- Open Graph
  OpenGraphSummary,
  // --------------- Schema.org JSON-LD
  WebpageSchema,
  BreadcrumbSchema,
  BlogPostSchema,
} from "@bodhi-project/seo";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AntD Components
import Tag from "antd/lib/tag";
import "antd/lib/tag/style/css";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ @bodhi-project/components
import Image from "@bodhi-project/components/lib/Image";
import Container from "@bodhi-project/components/lib/Container";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Locals
import seoHelper from "../helpers/seoHelper";
import packageJson from "../../package.json";
import markdownStylesClass from "../styles/markdownStyles";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Abstractions
// const { Fragment } = React;
const { data } = packageJson;
const { H1, Paragraph } = Elements;

// ----------------------------------------------------------------------------
// --------------------------------------------------------------------- Styles
// ----------------------------------------------------------------------------
const pageStyle = css({
  display: "block",
  position: "relative",

  "& blockquote": {
    border: "2px solid #daa520",
    background: "#fcf2f1",
    padding: "1em",
    "& p": {
      fontStyle: "italic",
      "&:last-child": {
        marginBottom: 0,
      },
    },
  },

  "& h1": {
    "& span": {
      fontSize: "90%",
    },
  },

  "& h3": {
    fontWeight: "700 !important",
  },

  "& hr": {
    border: "none",
    borderTop: "3px solid #B43808",
    marginBottom: 20,
  },

  "& .kale": {
    "@media(max-width: 768px)": {
      display: "block",
    },

    display: "flex",

    "& > div": {
      padding: "0em 1.25em",

      "&:nth-child(1)": {
        flexBasis: 0,
        flexGrow: 62,

        "& .hope": {
          display: "flex",

          "& > div": {
            "&:nth-child(1)": {
              flexBasis: 0,
              flexGrow: 50,
              paddingRight: "1.25em",
            },

            "&:nth-child(2)": {
              flexBasis: 0,
              flexGrow: 50,
            },
          },
        },
      },

      "&:nth-child(2)": {
        flexBasis: 0,
        flexGrow: 38,
      },
    },
  },

  "& .headings": {
    display: "flex",
    flexFlow: "row wrap",
    alignItems: "flex-start",

    "& .banner": {
      flex: "7 1 0%",
    },

    "& .abstract": {
      flex: "12 1 0%",

      "& h3": {
        marginTop: 0,
        marginBottom: 5,
      },
    },
  },
});
const pageStyleClass = pageStyle.toString();

// ----------------------------------------------------------------------------
// ------------------------------------------------------------------ Component
// ----------------------------------------------------------------------------
/** BlogPostTemplate */
class BlogPostTemplate extends React.Component {
  /** standard constructor */
  constructor(props) {
    super(props);
  }

  /** standard renderer */
  render() {
    // Abstract stuff
    const { pathContext } = this.props;
    const { frontmatter } = pathContext;
    // const { toc } = pathContext;
    const { markdownAst, next, prev } = pathContext;
    const { route, humanDate, elapsed } = pathContext;
    const checkedRoute = startsWith(route, "/") ? route : `/${route}`;
    const nakedRoute = checkedRoute.substr(1);

    // Date stuff
    const mDate = moment(frontmatter.date);
    const isoDate = mDate.format();

    const dateStr = moment(mDate).format("ddd, MMMM D, YYYY");
    const when = moment(mDate).fromNow();

    const catString = trim(last(split(frontmatter.category, ".")));

    // -------------------------------------------------------------------- SEO
    const pageData = {
      pageTitle: frontmatter.title,
      nakedPageSlug: nakedRoute,
      pageAbstract: frontmatter.abstract,
      pageBanner: frontmatter.cover,
    };

    const seoData = seoHelper(pageData);

    const {
      pageTitle,
      twitterSummaryX,
      generalMetaData,
      twitterSummaryCardData,
      openGraphSummaryData,
      webpageSchemaData,
      breadcrumbSchemaData,
    } = seoData;

    const blogPageSchemaData = {
      headline: frontmatter.title,
      image: twitterSummaryX,
      url: `${data.nakedWebsiteUrl}${route}`,
      datePublished: isoDate,
      description: frontmatter.abstract,
      publisher: data.org.name,
    };

    return (
      <div className={pageStyleClass}>
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SEO */}
        <UpdateTitle title={pageTitle} />
        <GeneralMeta data={generalMetaData} />
        <TwitterSummaryCard data={twitterSummaryCardData} />
        <OpenGraphSummary data={openGraphSummaryData} />
        <WebpageSchema data={webpageSchemaData} />
        <BreadcrumbSchema data={breadcrumbSchemaData} />
        <BlogPostSchema data={blogPageSchemaData} />

        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Content */}
        <div>
          <Container block bleed>
            <Header className="headings stash">
              <div className="banner">
                <Image
                  src={frontmatter.cover}
                  rawWidth={1440}
                  rawHeight={900}
                  loader="gradient"
                  style={{ border: 0, height: "auto !important" }}
                />
              </div>
              <div className="abstract">
                <H1 className="mask-h3" style={{ marginBottom: 5 }}>
                  {frontmatter.title}
                </H1>
                <Tag>{catString}</Tag>
                <Paragraph style={{ marginBottom: 0 }}>
                  <small>
                    <i>
                      {dateStr}&nbsp;({when})
                    </i>
                  </small>
                  <br />
                  <br />
                  {frontmatter.abstract}
                </Paragraph>
                <br />
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 99,
                      backgroundColor: "#f8f2e6",
                      zIndex: 10,
                      height: 20,
                      width: "calc(100% - 98px)",
                    }}
                  />
                  <div style={{ maxWidth: 98 }}>
                    <FacebookProvider appId="218604115574634">
                      <FBLike
                        href={`http://localhost:8000/${route}`}
                        colorScheme="dark"
                        showFaces
                        share
                      />
                    </FacebookProvider>
                  </div>
                </div>
              </div>
            </Header>
            <Page>
              <Article className={markdownStylesClass}>
                {treeCodeParser(
                  markdownAst,
                  {
                    localLink: Link,
                    linkHeaders: false,
                    trackHeaders: false,
                    nestHeaders: false,
                  },
                  {},
                )}
              </Article>
              <Footer>
                <H1 mask="h4">More like this…</H1>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {!isNull(prev) && (
                      <Link to={`/${prev.fields.route}`}>⇜ Previous</Link>
                    )}
                  </div>
                  <div>
                    {!isNull(next) && (
                      <Link to={`/${next.fields.route}`}>Next ⇝</Link>
                    )}
                  </div>
                </div>
                <Paragraph className="stash">
                  {data.copyright}
                  <br />
                  <br />
                  Published on {humanDate} ({elapsed}).
                </Paragraph>
              </Footer>
            </Page>
          </Container>
        </div>
      </div>
    );
  }
}

BlogPostTemplate.propTypes = {
  pathContext: PropTypes.object,
};

// ----------------------------------------------------------------------------
// --------------------------------------------------------------------- Export
// ----------------------------------------------------------------------------
export default BlogPostTemplate;
