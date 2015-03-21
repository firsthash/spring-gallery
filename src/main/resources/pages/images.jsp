<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
<head>
    <title></title>
    <style>
        img {
            max-width: 50%;
        }

        body {
            text-align: center;
        }

        ul {
            list-style: none;
        }
    </style>
</head>
<body>
    <ul>
        <c:forEach items="${images}" var="image">
            <li>
                <img src="/image/${image.id}" title="${image.name}"/>
            </li>
        </c:forEach>
    </ul>
</body>
</html>