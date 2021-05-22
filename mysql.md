## 常用的mysql语句

连接数据库

```mysql
# mysql -h 主机地址 -u 用户名  -p 用户密码	
mysql -hlocalhost -uroot -p
```

退出MySQL数据库

```mysql
exit（回车）
```

修改用户密码

```mysql
# mysqladmin -u 用户名 -p 旧密码 password 新密码
mysqladmin -u root -password ab12;
```

创建数据库

```mysql
# create database <数据库名>
create database book
```

显示数据库

```mysql
show databases;
```

删除数据库

```mysql
# drop database <数据库名>
drop database company;
```

选择数据库

```mysql
# use <数据库名>
use company;
```

创建数据表

```mysql
# create table <表名>
create table user
```

获取数据库表结构

```mysql
# desc <表名>;
desc user;
```

删除数据表

```mysql
# drop table <表名>	
drop table info;
```

向数据表中插入数据

```mysql
# insert into <表名> [(字段名1)[,...字段名n])] value (值1）[,(值n)];
insert into student (id,name,age) value (1,'张三',13);
```

查询数据表中的数据

```mysql
# select <字段1，字段2，...> from <表名> where <条件>; 	
select * from student;
```

修改数据表中的数据

```mysql
# update 表名 set 字段=新值,... where 条件;	
update student set age=20 where id=1;
```

增加字段

```mysql
# alter table 表名 add 字段 类型 其他;	
alter table student add address varchar(40) default null;
```

加主关键字

```mysql
# alter table 表名 add primary key (字段名);	
alter table student add primary key (id);
```

加唯一限制条件

```mysql
# alter table 表名 add unique 索引名（字段名）;	
alter table student add unique emp_name2(id);
```

查询表结构

```mysql
# show columns from student;
show columns from student;
```

修改数据库表名

```mysql
# rename table 原表名 to 新表名;
rename table student to stu;
```

删除记录

```mysql
# delete from 表名 where 表达式;
delete table student where id=1;
```

导出数据库

```mysql
# mysqldump -u 用户名 -p 数据库名 > 导出的文件名
mysqldump -uroot -p  company > 123.sql
```

导出数据表

```mysql
# mysqldump -u 用户名 -p 数据库名 表名>导出的文件名
mysqldump -uroot -p company admin > outfile.sql
```

查看第n行后的m条记录

```mysql
# select * from <表名> limit row,rows;
select * from student limit n,m;
```

